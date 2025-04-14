from typing import Optional

from agno.agent import Agent
from agno.models.openai.like import OpenAILike
from agno.storage.agent.postgres import PostgresAgentStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from backend.core.conf import settings
from backend.database.db import get_syn_db_url

from .agent_prompt.scholar_prompt import scholar_description, scholar_instructions

syn_db_url = get_syn_db_url()


def get_scholar(
    model_id: str = "deepseek-v3-250324",
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    debug_mode: bool = True,
) -> Agent:
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

    # 定义storage Persist session data
    storage = PostgresAgentStorage(table_name="scholar_sessions", db_url=syn_db_url, schema="public")
    
    # 定义 tools
    tools = [DuckDuckGoTools()]
    
    scholar_agent = Agent(
        name="Scholar",
        agent_id="scholar",
        user_id=user_id,
        session_id=session_id,
        model=model,
        # Tools available to the agent
        tools=tools,
        # Storage for the agent
        storage=storage,
        # Description of the agent
        description=scholar_description,
        # Instructions for the agent
        instructions=scholar_instructions,
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
        monitoring=True
    )
    
    return scholar_agent
