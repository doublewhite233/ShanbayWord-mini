import random

def getRandomID(num):
    list = [chr(i) for i in range(48, 58)] + [chr(i) for i in range(97, 123)]
    rand = random.sample(list, num)
    randID = ''.join(rand)
    return randID

if __name__ == '__main__' :
    print(getRandomID(5))
