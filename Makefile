.PHONY: setup lint format typecheck test check hooks

setup:
	uv sync
	uv run pre-commit install --install-hooks --hook-type pre-commit --hook-type commit-msg

lint:
	uv run ruff check .
	uv run ruff format --check .

format:
	uv run ruff check --fix .
	uv run ruff format .

typecheck:
	uv run mypy services infra

test:
	uv run pytest

check: lint typecheck test

hooks:
	uv run pre-commit run --all-files
