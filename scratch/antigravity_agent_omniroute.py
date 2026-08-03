"""
Google Antigravity SDK Agent with OmniRoute Gateway Integration
Demonstrates initializing an Antigravity agent connected to the OmniRoute API proxy gateway.
"""

import os
import asyncio
from google.antigravity import Agent, LocalAgentConfig, types

async def main():
    # 1. API key configuration (Reads from environment or AI Studio key)
    api_key = os.getenv("GEMINI_API_KEY", "your-gemini-api-key")

    # 2. Local Agent Configuration with OmniRoute Gateway & MCP integration
    config = LocalAgentConfig(
        api_key=api_key,
        model="gemini-1.5-flash",
        system_instruction=(
            "You are an autonomous AI Agent built with the Google Antigravity SDK. "
            "You route all requests through the OmniRoute proxy gateway to balance load "
            "and prevent quota exhaustion across AI models."
        ),
        # OmniRoute proxy integration can be passed via custom base URL or MCP transport
        mcp_servers=[
            types.McpSseServer(
                url="http://localhost:20128/v1/sse",
                headers={"Authorization": f"Bearer {api_key}"}
            )
        ]
    )

    print("🚀 Initializing Google Antigravity Agent with OmniRoute protection...")

    async with Agent(config) as agent:
        response = await agent.chat(
            "Hello Antigravity Agent! Verify that your execution loop is active and connected to OmniRoute."
        )
        print("\n🤖 Agent Response:\n", await response.text())

if __name__ == "__main__":
    asyncio.run(main())
