import anthropic
from dotenv import load_dotenv
load_dotenv()

client = anthropic.Anthropic()

session = client.beta.sessions.create(
    agent={"type": "agent", "id": "agent_011CaBYRR1xm5FGqziLzTxa2"},
    environment_id="env_01AzhWUqYrYqdyDfG97oWBpZ",
)

with client.beta.sessions.events.stream(
    session_id=session.id,
) as stream:
    client.beta.sessions.events.send(
        session_id=session.id,
        events=[
            {
                "type": "user.message",
                "content": [{"type": "text", "text": "Generate the ElevenLabs system prompt payload for Beat 3 using the 2:40pm forecast data."}],
            },
        ],
    )

    for event in stream:
        if event.type == "agent.message":
            for block in event.content:
                print(block.text, end="")
        elif event.type == "agent.tool_use":
            print(f"\n[Using tool: {event.name}]")
        elif event.type == "session.status_idle":
            print("\n\nAgent finished.")
            break