from os import getenv

from agno.playground import Playground

from backend.app.agent.service.agents.sage_agent import get_sage
from backend.app.agent.service.agents.scholar_agent import get_scholar

######################################################
# Router for the Playground Interface
######################################################

sage_agent = get_sage(debug_mode=True)
scholar_agent = get_scholar(debug_mode=True)

# Create a playground instance
playground = Playground(agents=[sage_agent, scholar_agent])

# Register the endpoint where playground routes are served with agno.com
if getenv("RUNTIME_ENV") == "dev":
    playground.create_endpoint(f"http://localhost:{6666}")

playground_router = playground.get_async_router()
