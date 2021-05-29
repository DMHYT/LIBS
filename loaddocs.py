from urllib import request as req
from os import getcwd
from time import time
print("downloading...")
first = time()
prev = time()
last = time()
def toMillis(secs):
    return int(round(secs * 1000, 0))
def download(file):
    global first, prev, last
    prev = last
    response = req.urlopen("https://docs.mineprogramming.org/" + file + ".d.ts")
    content = response.read().decode("utf-8")
    get_path = getcwd() + "\\declarations\\" + file + ".d.ts"
    with open(get_path, 'w') as docs:
        docs.write(content)
    last = time()
    print(file + " has been downloaded in " + str(toMillis(last - prev)) + " ms...")
download("core-engine")
download("android")
download("android-declarations")
print("completed in " + str(toMillis(last - first)) + " ms!")