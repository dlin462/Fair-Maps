#!/bin/bash
#
#SBATCH --job-name=test
#SBATCH --output=res.txt
#SBATCH --ntasks-per-node=28
#SBATCH --nodes=2
#SBATCH --time=05:00
#SBATCH -p short-28core
#SBATCH --mail-type=ALL
#SBATCH --mail-user=aaron.lin.2@stonybrook.edu


module load intel/compiler/64/2017/17.0.0
module load intel/mkl/64/2017/0.098
module load intel/mpi/64/2018/18.0.1 

module load python/3.9.7
module load scikit-learn/latest
module load gnu-parallel

cd /gpfs/projects/samples/intel_mpi_hello/
mpiicc mpi_hello.c -o intel_mpi_hello

mpirun ./intel_mpi_hello