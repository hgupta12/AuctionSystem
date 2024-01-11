import sys
import subprocess

procs = []
for i in range(8):
    proc = subprocess.Popen([sys.executable, 'main.py'])
    procs.append(proc)

for proc in procs:
    proc.wait()