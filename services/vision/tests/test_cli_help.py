import subprocess
import sys
from pathlib import Path

README = Path(__file__).parents[3] / "README.md"


def demo_modules() -> list[str]:
    """The module behind every `uv run` command in the README's demo section."""
    section = README.read_text(encoding="utf-8").split("\n## Run the demo\n")[1].split("\n## ")[0]
    lines = [line.strip() for line in section.splitlines()]
    commands = [line.split()[2:] for line in lines if line.startswith("uv run ")]
    return [argv[2] if argv[:2] == ["python", "-m"] else argv[0] for argv in commands]


def test_readme_demo_commands_print_their_help() -> None:
    modules = demo_modules()
    assert {"balomer_vision.soccertrack", "uvicorn", "balomer_vision.replay"} <= set(modules)
    for module in modules:
        result = subprocess.run(
            [sys.executable, "-m", module, "--help"], capture_output=True, text=True, check=False
        )
        assert result.returncode == 0, result.stderr
        assert "usage" in result.stdout.lower()
