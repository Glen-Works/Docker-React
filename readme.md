# 後台(react) #
使用docker-compose 建立環境  


### api 設定檔 ###
- [react 環境參數(**docker**) react_env_volume/.env](react_env_volume/.env)
- [react 環境參數(**本機**) cdn_client_react/.env](cdn_client_react/.env)
- [nginx 外部設定檔](nginx/nginx.conf)   

## build 說明 ##
-------------
~~docker-compose up -d~~
執行 run_docker.sh (覆蓋.env and run docker)
等待build，再來設定外部nginx
參考：
- [nginx 設定檔](nginx/nginx.conf)   

需修改(path)：
>server { 
>  server_name domain; #dns domain
>  error_log  /opt/nginx/error.log;   #error log 路徑
>  access_log  /opt/nginx/access.log; #access log 路徑
>  root /opt/cdn_client_react/build;  #依照react docker compiler path (build)
>  location /api/ {
>    proxy_pass http://localhost:8024; #修改為laravel domain:port
>  }
