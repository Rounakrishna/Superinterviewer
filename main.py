def pali(arr):
    rev = reversed(arr)
    temp = ''.join(reversed(arr))

    return temp == arr

    
name = "nitin"
k=pali(name)
print(k)