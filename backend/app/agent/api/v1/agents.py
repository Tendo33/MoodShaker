import json
import uuid

from datetime import datetime, timedelta
from typing import AsyncGenerator, List

from agno.agent import Agent
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from backend.app.agent.schema.agent_request_schema import AgentRequest, AgentType
from backend.app.agent.service.operator import get_agent
from backend.common.log import logger
from backend.database.redis import redis_client

######################################################
# Router for the Agent Interface
######################################################

agents_router = APIRouter(prefix="/agents", tags=["Agents"])


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


@agents_router.get(path="", response_model=List[str])
async def list_agents() -> List[str]:
    """
    Returns a list of all available agent IDs.

    Returns:
        List[str]: List of agent identifiers
    """
    return [agent.value for agent in AgentType]


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
    if hasattr(run_response, 'content'):
        # 如果 RunResponse 有 content 属性，直接返回内容
        if isinstance(run_response.content, dict):
            yield json.dumps(run_response.content, ensure_ascii=False)
        else:
            yield run_response.content
    else:
        # 如果 RunResponse 是一个迭代器，遍历它
        async for chunk in run_response:
            if hasattr(chunk, 'content'):
                if isinstance(chunk.content, dict):
                    yield json.dumps(chunk.content, ensure_ascii=False)
                else:
                    yield chunk.content
            else:
                if isinstance(chunk, dict):
                    yield json.dumps(chunk, ensure_ascii=False)
                else:
                    yield chunk


@agents_router.post("/sage/runs", status_code=status.HTTP_200_OK)
async def run_sage_agent(body: AgentRequest):
    """
    Sends a message to the Sage agent and returns the response.

    Args:
        body: Request parameters including the message

    Returns:
        Either a streaming response or the complete agent response
    """
    logger.debug(f"Sage AgentRequest: {body}")

    try:
        agent: Agent = get_agent(
            model_id=body.model.value,
            agent_id=AgentType.SAGE,
            user_id=body.user_id,
            session_id=body.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Sage agent not found: {str(e)}")

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


@agents_router.post("/scholar/runs", status_code=status.HTTP_200_OK)
async def run_scholar_agent(body: AgentRequest):
    """
    Sends a message to the Scholar agent and returns the response.

    Args:
        body: Request parameters including the message

    Returns:
        Either a streaming response or the complete agent response
    """
    logger.debug(f"Scholar AgentRequest: {body}")

    try:
        agent: Agent = get_agent(
            model_id=body.model.value,
            agent_id=AgentType.SCHOLAR,
            user_id=body.user_id,
            session_id=body.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Scholar agent not found: {str(e)}")

    if body.stream:
        return StreamingResponse(
            chat_response_streamer(agent, body.message),
            media_type="text/event-stream",
        )
    else:
        response = await agent.arun(body.message, stream=False)
        return response.content


@agents_router.post("/bartender/runs", status_code=status.HTTP_200_OK)
async def run_bartender_agent(body: AgentRequest):
    """
    Sends a message to the Bartender agent and returns the response.

    Args:
        body: Request parameters including the message

    Returns:
        Either a streaming response or the complete agent response
    """
    logger.debug(f"Bartender AgentRequest: {body}")

    try:
        agent: Agent = get_agent(
            model_id=body.model.value,
            agent_id=AgentType.BARTENDER,
            user_id=body.user_id,
            session_id=body.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Bartender agent not found: {str(e)}")

    if body.stream:
        return StreamingResponse(
            chat_response_streamer(agent, body.message),
            media_type="text/event-stream",
        )
    else:
        response = await agent.arun(body.message, stream=False)
        return response.content


@agents_router.post("/casual_chat/runs", status_code=status.HTTP_200_OK)
async def run_casual_chat_agent(body: AgentRequest):
    """
    Sends a message to the Casual Chat agent and returns the response.

    Args:
        body: Request parameters including the message

    Returns:
        Either a streaming response or the complete agent response
    """
    logger.debug(f"Casual Chat AgentRequest: {body}")

    try:
        agent: Agent = get_agent(
            model_id=body.model.value,
            agent_id=AgentType.CASUAL_CHAT,
            user_id=body.user_id,
            session_id=body.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Casual Chat agent not found: {str(e)}")

    if body.stream:
        return StreamingResponse(
            chat_response_streamer(agent, body.message),
            media_type="text/event-stream",
        )
    else:
        response = await agent.arun(body.message, stream=False)
        return response.content
