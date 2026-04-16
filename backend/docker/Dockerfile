FROM python:3.12-slim AS builder

WORKDIR /app
RUN pip install --no-cache-dir uv
COPY pyproject.toml .
RUN uv pip install --system --no-cache -e ".[dev]"

FROM python:3.12-slim

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY . .
ENV PYTHONPATH=/app/src
EXPOSE 8000

RUN chmod +x /app/docker/entrypoint.sh
CMD ["/app/docker/entrypoint.sh"]
