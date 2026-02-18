def extract_text(text=None):
    """."""
    return text or [p for p in reversed(text.partition("***")) if p][0]



text = """
fo
fo
fo
***
ba
ba
"""



print("text:", extract_text(text))

##(lambda : print('foo'))()


text = """
ba
ba
"""

print("text:", extract_text(text))


print('globals:', globals())