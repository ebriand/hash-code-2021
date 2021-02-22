MSYS_NO_PATHCONV=1 docker run -it --rm -v $(pwd)/.gcloud:/root/.config/gcloud google/cloud-sdk gcloud auth application-default login
