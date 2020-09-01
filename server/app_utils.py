import random

def getRandomID(num):
    list = [chr(i) for i in range(48, 58)] + [chr(i) for i in range(97, 123)]
    rand = random.sample(list, num)
    randID = ''.join(rand)
    return randID

def getRandom(num):
    return random.randint(1, num)

if __name__ == '__main__' :
    print(getRandomID(5))
    print(getRandom(10))
