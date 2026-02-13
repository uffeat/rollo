def main(use, **_):

    Timer = use("@@/tools:Timer")
    timer = use("@@/tools:timer")

    timer_1 = Timer(interval=1000, repeat=2, name="timer_1")

    @timer_1.target()
    def target_1(timer=None):
        print("target_1 called. Belongs to timer:", timer.name)

    @timer(interval=3000, repeat=2, name="timer_2")
    class foo:
        def __init__(self, timer=None):
            """."""
            print("foo.__init__ called. Belongs to timer:", timer.name)

        def __call__(self, timer=None):
            timer.repeat = 3
            print("foo called. Belongs to timer:", timer.name)




   
    return True
