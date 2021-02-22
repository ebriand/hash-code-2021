#! /bin/sh

MSYS_NO_PATHCONV=1 docker run --rm -v $(pwd)/.gcloud:/root/.config/gcloud google/cloud-sdk gcloud auth application-default print-access-token
