from typing import AsyncGenerator, List

from agno.agent import Agent
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from backend.app.admin.service.session_manager import (
    create_user_session,
    verify_session,
)
from backend.app.agent.schema.agent_request_schema import AgentRequest, AgentType
from backend.app.agent.service.agents.bartender_agent import get_bartender
from backend.app.agent.service.agents.casual_chat_agent import get_casual_chat_agent
from backend.app.agent.service.agents.sage_agent import get_sage
from backend.app.agent.service.agents.scholar_agent import get_scholar
from backend.common.log import logger
from backend.core.conf import settings

######################################################
# Router for the Agent Interface
######################################################

agents_router = APIRouter(prefix="/agents", tags=["Agents"])


class SessionRequest(BaseModel):
    user_id: int


class SessionResponse(BaseModel):
    session_id: str
    expires_in: int  # 会话过期时间(秒)


@agents_router.post("/session")
async def create_session(request: SessionRequest) -> SessionResponse:
    """
    创建新会话

    Args:
        request: 包含用户ID的请求

    Returns:
        SessionResponse: 包含会话ID和过期时间的响应
    """
    try:
        session_id = await create_user_session(request.user_id)
        return SessionResponse(session_id=session_id, expires_in=24 * 60 * 600)  # 24小时
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create session: {str(e)}"
        )


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
    async for chunk in run_response:
        # chunk.content only contains the text response from the Agent.
        # For advanced use cases, we should yield the entire chunk
        # that contains the tool calls and intermediate steps.
        logger.debug(f"Chunk: {chunk}")
        yield chunk.content


@agents_router.post("/sage", status_code=status.HTTP_200_OK)
async def run_sage_agent_stream(body: AgentRequest):
    """
    Sends a message to the Sage agent and returns a streaming response.

    Args:
        body: Request parameters including the message

    Returns:
        Streaming response from the agent
    """
    logger.debug(f"Sage AgentRequest: {body}")

    try:
        user_id = body.user_id
        session_id = body.session_id
        message = body.message
        model = body.model
        debug_mode = settings.ENVIRONMENT == "dev"

        # 验证会话
        await verify_session(user_id, session_id)

        # 使用工厂函数获取 Sage agent
        agent = get_sage(user_id=user_id, session_id=session_id, model_id=model, debug_mode=debug_mode)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Sage agent not found: {str(e)}")

    return StreamingResponse(
        chat_response_streamer(agent, message),
        media_type="text/event-stream",
    )


@agents_router.post("/scholar", status_code=status.HTTP_200_OK)
async def run_scholar_agent_stream(body: AgentRequest):
    """
    Sends a message to the Scholar agent and returns a streaming response.

    Args:
        body: Request parameters including the message

    Returns:
        Streaming response from the agent
    """
    logger.debug(f"Scholar AgentRequest: {body}")

    try:
        user_id = body.user_id
        session_id = body.session_id
        message = body.message
        model = body.model
        debug_mode = settings.ENVIRONMENT == "dev"

        # 验证会话
        await verify_session(user_id, session_id)

        # 使用工厂函数获取 Scholar agent
        agent = get_scholar(user_id=user_id, session_id=session_id, model_id=model, debug_mode=debug_mode)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Scholar agent not found: {str(e)}")

    return StreamingResponse(
        chat_response_streamer(agent, message),
        media_type="text/event-stream",
    )


@agents_router.post("/bartender", status_code=status.HTTP_200_OK)
async def run_bartender_agent(body: AgentRequest):
    """
    Sends a message to the Bartender agent and returns the complete response.

    Args:
        body: Request parameters including the message

    Returns:
        Complete response from the agent
    """
    logger.debug(f"Bartender AgentRequest: {body}")

    try:
        user_id = body.user_id
        session_id = body.session_id
        message = body.message
        model = body.model
        debug_mode = settings.ENVIRONMENT == "dev"
        # 验证会话
        await verify_session(user_id, session_id)

        # 使用工厂函数获取 Bartender agent
        agent = get_bartender(user_id=user_id, session_id=session_id, model_id=model, debug_mode=debug_mode)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Bartender agent not found: {str(e)}")

    response = await agent.arun(message, stream=False)
    return response.content


@agents_router.post("/casual_chat", status_code=status.HTTP_200_OK)
async def run_casual_chat_agent_stream(body: AgentRequest):
    """
    Sends a message to the Casual Chat agent and returns a streaming response.

    Args:
        body: Request parameters including the message

    Returns:
        Streaming response from the agent
    """
    logger.debug(f"Casual Chat AgentRequest: {body}")

    try:
        user_id = body.user_id
        session_id = body.session_id
        message = body.message
        model = body.model
        debug_mode = settings.ENVIRONMENT == "dev"
        # 验证会话

        await verify_session(user_id, session_id)

        # 使用工厂函数获取 Casual Chat agent
        casual_chat_agent = get_casual_chat_agent(
            user_id=user_id, session_id=session_id, model_id=model, debug_mode=debug_mode
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Casual Chat agent not found: {str(e)}")

    return StreamingResponse(
        chat_response_streamer(casual_chat_agent, message),
        media_type="text/event-stream",
    )
