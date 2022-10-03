FROM centos:8
CMD [ "/usr/sbin/init" ]
RUN cd /etc/yum.repos.d/
RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
RUN sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
RUN yum update -y
RUN curl --silent --location https://rpm.nodesource.com/setup_18.x | bash -
RUN yum install nodejs -y
RUN curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn
RUN npm i @ant-design/pro-cli -g