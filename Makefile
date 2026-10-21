.PHONY: setup lint format typecheck test check hooks contracts

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
	uv run mypy services packages infra

test:
	uv run pytest

check: lint typecheck test

hooks:
	uv run pre-commit run --all-files

contracts:
	uv run datamodel-codegen --input packages/contracts/schemas --input-file-type jsonschema \
		--output packages/contracts/src/balomer_contracts/models \
		--output-model-type pydantic_v2.BaseModel --target-python-version 3.12 \
		--enum-field-as-literal all --collapse-root-models --use-title-as-name \
		--use-standard-collections --use-union-operator --use-annotated --field-constraints \
		--use-schema-description --use-field-description --all-exports-scope children \
		--disable-timestamp --formatters ruff-format ruff-check
	npx --yes json-schema-to-typescript@16.0.0 --cwd packages/contracts/schemas \
		--input packages/contracts/schemas/message.schema.json --output apps/tv/src/contracts.ts
