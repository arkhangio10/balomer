# services/agent — tactical agent

Turns the first half's metric snapshots into the halftime report: three
evidence-based recommendations. In local mode it is a function the API calls
in-process (`balomer_agent.report.generate`), with Strands and Bedrock. A
validator rejects any evidence that is not in the input, any digit in the text,
and any problem or adjustment over 110 characters. A second failure gives a
"report unavailable" state.

The agent never invents numbers. Every claim it makes is grounded in a metric
produced by `services/vision`.

It needs `AWS_PROFILE`, `AWS_DEFAULT_REGION` and `BEDROCK_MODEL_ID`: see the root README.
