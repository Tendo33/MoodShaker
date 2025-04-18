from typing import Optional

from agno.agent import Agent, AgentKnowledge
from agno.embedder.openai import OpenAIEmbedder
from agno.memory.v2.db.postgres import PostgresMemoryDb
from agno.memory.v2.memory import Memory
from agno.models.openai.like import OpenAILike
from agno.storage.agent.postgres import PostgresAgentStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.vectordb.pgvector import PgVector
from backend.core.conf import settings
from backend.database.db import get_syn_db_url

from .agent_prompt.sage_pompt import sage_description, sage_instructions

syn_db_url = get_syn_db_url()


def get_sage(
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
        table_name="agent_memory",  # Table name to use in the database
        db_url=syn_db_url,
        schema="public",  # Schema name for the table (optional)
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
            table_name="agentic_rag_documents",
            schema="public",
            embedder=embedder,
        ),
        num_documents=3,  # Retrieve 3 most relevant documents
    )

    # 定义storage Persist session data
    storage = PostgresAgentStorage(table_name="sage_sessions", db_url=syn_db_url, schema="public")

    # 定义 tools
    tools = [DuckDuckGoTools()]

    # 组合成 agent
    sage_agent = Agent(
        name="Sage",
        agent_id="sage",
        user_id=user_id,
        session_id=session_id,
        model=model,
        # Tools available to the agent
        tools=tools,
        # Storage for the agent
        storage=storage,
        # Knowledge base for the agent
        knowledge=knowledge,
        search_knowledge=True,
        memory=memory,
        # Description of the agent
        description=sage_description,
        # Instructions for the agent
        instructions=sage_instructions,
        additional_context=additional_context,
        # Format responses using markdown
        markdown=True,
        # Add the current date and time to the instructions
        add_datetime_to_instructions=True,
        # Send the last 3 messages from the chat history
        add_history_to_messages=True,
        num_history_responses=3,
        # Add a tool to read the chat history if needed
        read_chat_history=True,
        # Show debug logs
        debug_mode=debug_mode,
        monitoring=True,
    )
    return sage_agent
