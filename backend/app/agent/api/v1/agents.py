import uuid

from datetime import datetime, timedelta
from typing import AsyncGenerator, List

from agno.agent import Agent
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from backend.app.agent.schema.agent_request_shema import AgentRequest
from backend.app.agent.service.operator import AgentType, get_agent, get_available_agents
from backend.common.log import logger
from backend.database.redis import redis_client

######################################################
# Router for the Agent Interface
######################################################

agents_router = APIRouter(prefix="/agents", tags=["Agents"])


@agents_router.get(path="", response_model=List[str])
async def list_agents() -> List[str]:
    """
    Returns a list of all available agent IDs.

    Returns:
        List[str]: List of agent identifiers
    """
    return get_available_agents()


async def chat_response_streamer(agent: Agent, message: str) -> AsyncGenerator:
    """
    Stream agent responses chunk by chunk.

    Args:
        agent: The agent instance to interact with
        message: User message to process

    Yields:
        Text chunks from the agent response
    """
    run_response = await agent.arun(message, stream=True)
    async for chunk in run_response:
        # chunk.content only contains the text response from the Agent.
        # For advanced use cases, we should yield the entire chunk
        # that contains the tool calls and intermediate steps.
        yield chunk.content


@agents_router.post("/{agent_id}/runs", status_code=status.HTTP_200_OK)
async def run_agent(agent_id: AgentType, body: AgentRequest):
    """
    Sends a message to a specific agent and returns the response.

    Args:
        agent_id: The ID of the agent to interact with
        body: Request parameters including the message

    Returns:
        Either a streaming response or the complete agent response
    """
    logger.debug(f"AgentRequest: {body}")

    try:
        agent: Agent = get_agent(
            model_id=body.model.value,
            agent_id=agent_id,
            user_id=body.user_id,
            session_id=body.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Agent not found: {str(e)}")

    if body.stream:
        return StreamingResponse(
            chat_response_streamer(agent, body.message),
            media_type="text/event-stream",
        )
    else:
        response = await agent.arun(body.message, stream=False)
        # response.content only contains the text response from the Agent.
        # For advanced use cases, we should yield the entire response
        # that contains the tool calls and intermediate steps.
        return response.content


async def create_user_session(user_id: int):
    session_id = str(uuid.uuid4())
    # 将 session_id 存储在 Redis 中，设置过期时间（例如 24 小时）
    await redis_client.setex(f"user_session:{user_id}:{session_id}", timedelta(hours=24), datetime.now().isoformat())
    return session_id


async def verify_session(user_id: int, session_id: str):
    # 检查 session 是否有效
    session_key = f"user_session:{user_id}:{session_id}"
    session_data = await redis_client.get(session_key)
    if not session_data:
        raise HTTPException(status_code=401, detail="Session expired")
    return True
