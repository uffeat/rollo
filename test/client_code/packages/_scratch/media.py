def main(use, *args, **kwargs):
    """Replaces media package."""
    
    

    

    def upload(*args, dto=None, **kwargs):
        """."""
        ##print("dto:", dto)  ##

        content = getattr(dto, "content", None)
        dto = dict(dto)
        [encoding, content_type, name] = [
            dto.get("encoding"),
            dto.get("content_type", "data"),
            dto.get("name"),
        ]
        if encoding == "binary":
            blob = use.works.to_media(content, content_type=content_type, name=name)
        elif encoding == "text":
            blob = use.works.BlobMedia(content_type, content.encode("utf-8"), name=name)
        else:
            use.console.error("encoding", encoding)
            raise NotImplementedError(f"Unsupported encoding (trace: {__file__}).")

        ##print("blob:", blob)  ##

        return use.rpc.upload()(file=blob)

    return upload
