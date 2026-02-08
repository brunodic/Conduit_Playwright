@echo off
echo Criando estrutura de pastas de automação...

mkdir automation
cd automation

mkdir docs
mkdir config
mkdir tests
mkdir helpers
mkdir services
mkdir reports
mkdir screenshots
mkdir logs
mkdir scripts

cd config
type nul > dev.env
type nul > hml.env
type nul > prod.env
cd ..

cd tests
mkdir ui
mkdir api
mkdir mobile

cd ui
mkdir pages
mkdir specs
mkdir fixtures
cd ..

cd api
mkdir clients
mkdir specs
mkdir schemas
cd ..

cd ..

echo Estrutura criada com sucesso.
pause
