class Submission:
    def __init__(self):
        self._ = dict(count=0)

    def __call__(self):
        result = self._['count']
        self._['count'] += 1
        return result



Submission = Submission()