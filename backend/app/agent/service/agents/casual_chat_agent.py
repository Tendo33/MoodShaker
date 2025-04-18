from typing import Optional

from agno.agent import Agent, AgentKnowledge
from agno.embedder.openai import OpenAIEmbedder
from agno.memory.v2.db.postgres import PostgresMemoryDb
from agno.memory.v2.memory import Memory
from agno.models.openai.like import OpenAILike
from agno.storage.agent.postgres import PostgresAgentStorage
from agno.vectordb.pgvector import PgVector
from backend.core.conf import settings
from backend.database.db import get_syn_db_url

from .agent_prompt.casual_chat_prompt import casual_chat_description, casual_chat_instructions

syn_db_url = get_syn_db_url()


def get_casual_chat_agent(
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
    )

    # 定义 persistent memory for chat history
    memory_db = PostgresMemoryDb(
        table_name="chat_memory",
        db_url=syn_db_url,
        schema="public",
    )
    memory = Memory(model=model, db=memory_db)

    # 定义 Embedder
    embedder = OpenAIEmbedder(
        id=settings.EMBEDDING_MODEL_NAME,
        dimensions=1024,
        api_key=settings.EMBEDDING_API_KEY,
        base_url=settings.EMBEDDING_BASE_URL,
    )

    # 定义 knowledge base
    knowledge = AgentKnowledge(
        vector_db=PgVector(
            db_url=syn_db_url,
            table_name="chat_knowledge",
            schema="public",
            embedder=embedder,
        ),
        num_documents=3,
    )

    # 定义 storage
    storage = PostgresAgentStorage(
        table_name="casual_chat_sessions",
        db_url=syn_db_url,
        schema="public"
    )

    # 组合成 agent
    casual_chat_agent = Agent(
        name="Casual_chat",
        agent_id="casual_chat",
        user_id=user_id,
        session_id=session_id,
        model=model,
        storage=storage,
        knowledge=knowledge,
        search_knowledge=True,
        memory=memory,
        description=casual_chat_description,
        instructions=casual_chat_instructions,
        additional_context=additional_context,
        markdown=True,
        add_datetime_to_instructions=True,
        add_history_to_messages=True,
        num_history_responses=10, 
        read_chat_history=True,
        debug_mode=debug_mode,
        monitoring=True
    )

    return casual_chat_agent 