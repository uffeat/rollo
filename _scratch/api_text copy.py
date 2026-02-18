def extract_text(text=None):
    """."""
    if text:
        return [p for p in reversed(text.partition("***")) if p][0]



text = """
fo
fo
fo
***
ba
ba
"""


parts = [p for p in reversed(text.partition("***")) if p]
##parts.reverse()
print("parts:", parts)

##(lambda : print('foo'))()


text = """
ba
ba
"""

parts = [p for p in text.partition("***") if p]
parts.reverse()
print("parts:", parts)
