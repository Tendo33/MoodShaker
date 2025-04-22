from typing import AsyncGenerator, List

from agno.agent import Agent
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from backend.app.admin.service.session_manager import (
    get_cocktail_image_url,
    store_cocktail_image_url,
)
from backend.app.agent.schema.agent_request_schema import AgentRequest, AgentType, BartenderRequest
from backend.app.agent.schema.cocktail_schema import CocktailRecommendation
from backend.app.agent.service.agents.casual_chat_agent import get_casual_chat_agent
from backend.app.agent.service.agents.classic_bartender_agent import get_classic_bartender
from backend.app.agent.service.agents.creative_bartender_agent import get_creative_bartender
from backend.app.agent.service.utils.image_generator import generate_cocktail_image
from backend.common.log import logger
from backend.core.conf import settings

######################################################
# Router for the Agent Interface
######################################################

agents_router = APIRouter(prefix="/agents", tags=["Agents"])


@agents_router.get(path="/list_agents", response_model=List[str])
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
        logger.debug(f"Chunk: {chunk}")
        yield chunk.content


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
        # await verify_session(user_id, session_id)
        casual_chat_agent = get_casual_chat_agent(
            user_id=user_id, session_id=session_id, model_id=model, debug_mode=debug_mode
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Casual Chat agent not found: {str(e)}")

    return StreamingResponse(
        chat_response_streamer(casual_chat_agent, message),
        media_type="text/event-stream",
    )


async def generate_and_store_image(cocktail: CocktailRecommendation, user_id: int, session_id: str) -> None:
    """
    异步生成并存储鸡尾酒图片

    Args:
        cocktail: 鸡尾酒推荐信息
        user_id: 用户ID
        session_id: 会话ID
    """
    try:
        image_url = await generate_cocktail_image(cocktail)
        if image_url:
            await store_cocktail_image_url(user_id, session_id, image_url)
            logger.info(f"Generated and stored image for user {user_id}: {session_id}")
    except Exception as e:
        logger.error(f"Failed to generate image for user {user_id}: {session_id}, error: {str(e)}")


@agents_router.post("/classic_bartender", status_code=status.HTTP_200_OK)
async def run_classic_bartender_agent(body: BartenderRequest):
    """
    发送消息给经典调酒师 agent 并返回完整响应。

    Args:
        body: 包含选择题选项和消息的请求参数

    Returns:
        来自 agent 的完整响应
    """
    logger.debug(f"Classic Bartender AgentRequest: {body}")

    try:
        user_id = body.user_id
        session_id = body.session_id
        model = body.model
        debug_mode = settings.ENVIRONMENT == "dev"
        # 验证会话
        # await verify_session(user_id, session_id)

        agent = get_classic_bartender(user_id=user_id, session_id=session_id, model_id=model, debug_mode=debug_mode)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Classic Bartender agent not found: {str(e)}"
        )

    # 使用组装好的用户提示
    user_prompt = body.get_user_prompt()
    response = await agent.arun(user_prompt, stream=False)
    
    # 生成并存储鸡尾酒图片
    await generate_and_store_image(response.content, user_id, session_id)
    
    return response.content


@agents_router.post("/creative_bartender", status_code=status.HTTP_200_OK)
async def run_creative_bartender_agent(body: BartenderRequest):
    """
    发送消息给创意调酒师 agent 并返回完整响应。

    Args:
        body: 包含选择题选项和消息的请求参数

    Returns:
        来自 agent 的完整响应
    """
    logger.debug(f"Creative Bartender AgentRequest: {body}")

    try:
        user_id = body.user_id
        session_id = body.session_id
        model = body.model
        debug_mode = settings.ENVIRONMENT == "dev"
        # 验证会话
        # await verify_session(user_id, session_id)

        agent = get_creative_bartender(user_id=user_id, session_id=session_id, model_id=model, debug_mode=debug_mode)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Creative Bartender agent not found: {str(e)}"
        )

    # 使用组装好的用户提示
    user_prompt = body.get_user_prompt()
    response = await agent.arun(user_prompt, stream=False)
    
    # 生成并存储鸡尾酒图片
    await generate_and_store_image(response.content, user_id, session_id)
    
    return response.content


@agents_router.get("/cocktail_image", status_code=status.HTTP_200_OK)
async def get_cocktail_image(user_id: int, session_id: str):
    """
    获取鸡尾酒图片URL

    Args:
        user_id: 用户ID
        session_id: 会话ID

    Returns:
        图片URL,如果不存在则返回404
    """
    image_url = await get_cocktail_image_url(user_id, session_id)
    if not image_url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found or not ready yet")
    return {"image_url": image_url}
