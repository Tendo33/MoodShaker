from typing import List, Optional

from agno.agent import Agent

from backend.app.agent.schema.agent_request_schema import AgentType
from backend.app.agent.service.agents.bartender_agent import get_bartender
from backend.app.agent.service.agents.casual_chat_agent import get_casual_chat_agent
from backend.app.agent.service.agents.sage_agent import get_sage
from backend.app.agent.service.agents.scholar_agent import get_scholar


def get_available_agents() -> List[str]:
    """Returns a list of all available agent IDs."""
    return [agent.value for agent in AgentType]


def get_agent(
    model_id: str = "deepseek-v3-250324",
    agent_id: Optional[AgentType] = None,
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    debug_mode: bool = True,
) -> Agent:
    if agent_id == AgentType.SAGE:
        return get_sage(model_id=model_id, user_id=user_id, session_id=session_id, debug_mode=debug_mode)
    elif agent_id == AgentType.SCHOLAR:
        return get_scholar(model_id=model_id, user_id=user_id, session_id=session_id, debug_mode=debug_mode)
    elif agent_id == AgentType.BARTENDER:
        return get_bartender(model_id=model_id, user_id=user_id, session_id=session_id, debug_mode=debug_mode)
    elif agent_id == AgentType.CASUAL_CHAT:
        return get_casual_chat_agent(model_id=model_id, user_id=user_id, session_id=session_id, debug_mode=debug_mode)
    else:
        raise ValueError(f"Unknown agent type: {agent_id}")
