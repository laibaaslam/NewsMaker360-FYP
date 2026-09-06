import logging
import sys
import warnings

# Silence library logs so only resolved text goes to stdout.
logging.disable(logging.WARNING)
warnings.filterwarnings("ignore")


def read_input_text():
    if len(sys.argv) >= 3 and sys.argv[1] == "--file":
        with open(sys.argv[2], "r", encoding="utf-8") as handle:
            return handle.read()

    if len(sys.argv) >= 2:
        return sys.argv[1]

    print("Missing input text", file=sys.stderr)
    sys.exit(1)


def main():
    text = read_input_text()

    try:
        import spacy
        from fastcoref import spacy_component  # noqa: F401

        nlp = spacy.load("en_core_web_sm")
        nlp.add_pipe("fastcoref")
        doc = nlp(
            text,
            component_cfg={"fastcoref": {"resolve_text": True}},
        )
        resolved = getattr(doc._, "resolved_text", None) or text
        sys.stdout.write(resolved)
        sys.stdout.flush()
    except Exception as error:
        print(f"fastcoref unavailable, using original text: {error}", file=sys.stderr)
        sys.stdout.write(text)
        sys.stdout.flush()


if __name__ == "__main__":
    main()
