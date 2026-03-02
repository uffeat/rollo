class parse_data_url:

    SEP = ";base64,"

    def __call__(self, data_url: str) -> str:
        """Returns b64 part from dataURL."""
        *_, rest = data_url.partition(self.SEP)
        if not rest:
            raise ValueError(f"Not a dataURL: {str(data_url)}")
        return rest


parse_data_url = parse_data_url()
