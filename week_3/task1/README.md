## Holiday Managment system project
# Pre-requirements
1. Visit this site https://www.postgresql.org/download/ and download last version of PostgreSQL for your system. 
# How to run
1. You need to setup a password like '1234'. Go to the installed directory in the bin folder. Run a command ```psql -U postgres```. After this you can write SQL queries. Database can be named like 'EHMS'.
2. Clone repo 
```git clone https://github.com/aunth/BackendBrigade/tree/main/week_3/task1```
3. Download dependencies
```npm install```
4. In the 'database.ts' file setup the varibale 'synchronize: true,' (for creating a table)
5. Run main application
```npm run devStart```
6. After that you need to stop and change variable 'synchronize: false' and in PostgreSQL console you have to paste queries from 'database.sql' file to setup basic data
7. Run main application to use and have fun :)
```npm run devStart```
