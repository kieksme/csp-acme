# API image build

The CLI 0.6.1 transition patch uses Docker’s official Node 22 Bookworm slim image
from [Amazon ECR Public](https://gallery.ecr.aws/docker/library/node) for both
Docker stages. The multi-platform manifest is pinned by digest so both stages use
the reviewed version; updating the image requires updating both references.

This avoids Docker Hub download and authentication failures blocking the customer
workflow before its frontend and API artifacts are uploaded. ECR Public serves
[Docker Official Images](https://aws.amazon.com/blogs/containers/docker-official-images-now-available-on-amazon-elastic-container-registry-public/)
without requiring registry credentials. No additional Actions secret is needed.

The customer runtime remains non-root and includes curl for HTTP healthchecks.
The CLI still builds `dist-api/server.js` before Docker builds the image. Keep
that output in the Docker build context; only frontend `dist` is excluded.
