# AI and LLM Integration

## Current implementation
A provider-independent LLM service abstraction is in place with a mock provider by default.

## Planned integration
- Replace `mock` provider with Vultr Serverless Inference or compatible OpenAI-style endpoint.
- Use environment-based configuration in `backend/app/core/config.py`.
- Keep prompt and provider logic isolated behind service boundaries.
- Validate structured output before persisting.
