from typing import Optional

from agno.agent import Agent, AgentKnowledge
from agno.embedder.openai import OpenAIEmbedder
from agno.memory.v2.db.postgres import PostgresMemoryDb
from agno.memory.v2.memory import Memory
from agno.models.openai.like import OpenAILike
from agno.storage.agent.postgres import PostgresAgentStorage
from agno.vectordb.pgvector import PgVector
from backend.app.agent.schema.cocktail_schema import CocktailRecommendation
from backend.core.conf import settings
from backend.database.db import get_syn_db_url

from .agent_prompt.creative_bartender_prompt import creative_bartender_description, creative_bartender_instructions

syn_db_url = get_syn_db_url()


def get_creative_bartender(
    model_id: str = "deepseek-v3-250324",
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    debug_mode: bool = True,
) -> Agent:
    # 定义 additional context
    additional_context = ""
    if user_id:
        additional_context += "<context>"
        additional_context += f"You are interacting with the user: {user_id}"
        additional_context += "</context>"

    # 定义模型
    model = OpenAILike(
        id=model_id,
        api_key=settings.OPENAI_API_KEY,
        base_url=settings.OPENAI_BASE_URL,
        temperature=0.8,  # 更高的温度以鼓励创意
    )

    # 定义 persistent memory for chat history
    memory_db = PostgresMemoryDb(
        table_name="creative_bartender_memory",
        db_url=syn_db_url,
        schema="public",
    )
    memory = Memory(model=model, db=memory_db)

    # 定义 Embedder
    embedder = OpenAIEmbedder(
        id=settings.SILICONFLOW_MODEL_NAME,
        dimensions=1024,
        api_key=settings.SILICONFLOW_API_KEY,
        base_url=settings.SILICONFLOW_BASE_URL,
    )

    # 定义 knowledge base
    knowledge = AgentKnowledge(
        vector_db=PgVector(
            db_url=syn_db_url,
            table_name="creative_bartender_knowledge",
            schema="public",
            embedder=embedder,
        ),
        num_documents=5,
    )

    # 定义 storage
    storage = PostgresAgentStorage(table_name="creative_bartender_storage", db_url=syn_db_url, schema="public")

    # 定义 tools
    tools = None

    # 组合成 agent
    creative_bartender_agent = Agent(
        name="Creative Bartender",
        agent_id="creative_bartender",
        user_id=user_id,
        session_id=session_id,
        model=model,
        storage=storage,
        knowledge=knowledge,
        search_knowledge=True,
        memory=memory,
        enable_user_memories=True,
        description=creative_bartender_description,
        instructions=creative_bartender_instructions,
        additional_context=additional_context,
        add_datetime_to_instructions=True,
        add_history_to_messages=True,
        num_history_responses=10,
        read_chat_history=True,
        debug_mode=debug_mode,
        tools=tools,
        show_tool_calls=True,
        monitoring=True,
        response_model=CocktailRecommendation,
    )

    return creative_bartender_agent
