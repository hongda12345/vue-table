var Wait=Vue.component('Wait',{
    props:['waitShow'],
    template:`<div class="wait" v-show="waitShow==true"></div>`
})
var Info=Vue.component('Info',{
    props:['message','infoShow'],
    template:`<div class="Info" v-show="infoShow==true">{{message}}</div>`
})
var Head=Vue.component('Head',{
    template:`
<nav>
    <router-link to="/" exact tag="span" class="link">首页</router-link>
    <router-link to="/add" tag="span" class="link">添加</router-link>
    <span @click="loginout">退出登录</span>
</nav>
    `,
    methods:{
        loginout(){
            sessionStorage.removeItem('login');
            this.$router.push("/login");
        }
    }
})
var Main=Vue.component('Main',{
    template:
        `<div>
            <Head></Head>
            <router-view></router-view>
        </div>`
})
var Table=Vue.component('Table',{
    props:['Tablehead'],
    template:`
<div>
<Wait :waitShow="waitShow"></Wait>
<Info :infoShow="infoShow" :message="message"></Info>
<table>
            <tr>
               <th v-for="item in Tablehead">{{item}}</th>
               <th>操作</th>
            </tr>
            <tr v-for="item in datas">
                 <td>{{item.name}}</td>
                 <td>{{item.age}}</td>
                 <td>{{item.sex}}</td>
                 <td>
                    <a @click="del(item.id)" style="cursor:pointer;">删除</a>
                    <router-link :to="'/edit/'+item.id" style="cursor:pointer;"></router-link>
                 </td>
            </tr>
        </table>
</div>   
    `,
    data(){
        return{
            datas:[

            ],
            waitShow:true,
            infoShow:false,
            message:''
        }
    },
    methods:{
      del(id){
          fetch('/del/'+id).then(function (e) {
              return e.text()
          }).then((e)=> {
              if(e =='ok'){
                  this.datas=this.datas.filter(function (item) {
                      if(item.id!=id){
                          return item;
                      }
                  })
                  this.infoShow=true;
                  this.message="删除成功";
              }else{
                  this.infoShow=false;
                  this.message="删除失败";
              }
          })
      }
    },
    mounted(){
        fetch('/fetch').then(function (e) {
            return e.json();
        }).then((e)=> {
            this.datas=e;
            this.waitShow=false;
        })
    }
})

var Index=Vue.component('Index',{
    template:`
        <div>
            <Table :Tablehead="['姓名','年龄','性别']" class="custom-table"></Table>
        </div>
    `
})
var Add=Vue.component('Add',{
    template:`
<div>
<Wait :waitShow="waitShow"></Wait>
<Info :infoShow="infoShow" :message="message"></Info>  
<form>
              <div class="form-group">
                <label for="name">姓名</label>
                <input type="text" class="form-control" id="name" name="name" placeholder="姓名" v-model="name">
              </div>
              <div class="form-group">
                <label for="age">年龄</label>
                <input type="text" class="form-control" id="age" name="age" placeholder="年龄" v-model="age">
              </div>
              <div class="form-group">
                <label for="sex">性别</label>
                <input type="text" class="form-control" id="sex" name="sex" placeholder="性别" v-model="sex">
              </div>
              <button type="button" class="btn btn-default" @click="submit()">Submit</button>
            </form>
</div>
     `,
    data(){
        return {
            name:'',
            age:'',
            sex:'',
            waitShow:false,
            infoShow:false,
            message:''
        }
    },
    methods:{
        submit(){
           this.waitShow=true;
           var datastring='name='+this.name+'&age='+this.age+'&sex='+this.sex;
           fetch('/addcon?'+datastring).then(function (e) {
               return e.text()
           }).then((e)=>{
               this.waitShow=false;
               this.infoShow=true;
               if(e == 'ok'){
                   this.message= "添加成功";
                   this.name='';
                   this.age='';
                   this.sex=''
               }else{
                   this.infoShow=true;
                   this.message="添加失败"
               }
           })
        }
    }
})
var Edit=Vue.component('Edit',{
    template:`
<div>
<Wait :waitShow="waitShow"></Wait>
<Info :infoShow="infoShow" :message="message"></Info> 
<form>
              <div class="form-group">
                <label for="name">姓名</label>
                <input type="text" class="form-control" id="name" placeholder="姓名" v-model="name">
              </div>
              <div class="form-group">
                <label for="age">年龄</label>
                <input type="text" class="form-control" id="age" placeholder="年龄" v-model="age">
              </div>
              <div class="form-group">
                <label for="sex">性别</label>
                <input type="text" class="form-control" id="sex" placeholder="性别" v-model="sex">
              </div>
              <button type="button" class="btn btn-default" @click="update">Submit</button>
            </form>
</div>
            
     `,
    data(){
        return {
            name:'',
            age:'',
            sex:'',
            waitShow:true,
            infoShow:false,
            message:''
        }
    },
    methods:{
        update(){
            this.waitShow=true;
            var datastring='name='+this.name+'&age='+this.age+'&sex='+this.sex+'&id='+this.$route.params.id;
            fetch('/editcon?'+datastring).then(function (e) {
                return e.text()
            }).then((e) =>{
                this.waitShow=false;
                this.infoShow=true;
                if(e=='ok'){
                    this.message="修改成功";
                }else{
                    this.infoShow=true;
                    this.message="修改失败";
                }
            })
        }
    },
    mounted(){
        fetch('/edit/'+that.$route.params.id).then(function (e) {
            return e.json();
        }).then(function (e) {
            this.name=e[0].name;
            this.age=e[0].age;
            this.sex=e[0].sex;
            this.waitShow=false;
        })
    }
})
var Login=Vue.component('Login',{
    template:`
    <div>
        <h3>登录页面 <router-link to="/reg">注册页面</router-link></h3>
        <div>{{message}}</div>
        <form>
            用户名:<input type="text" v-model="name"><br>
            密码:<input type="text" v-model="pass"><br>
            <input type="button" value="登录" @click="check">
        </form>
    </div>`,
    data(){
        return{
            name:'',
            pass:'',
            message:''
        }
    },
    methods:{
        check(){
            var search="name="+this.name+"&pass="+this.pass;
            fetch("/check?"+search).then(function(e){
                return e.json();
            }).then((e)=>{
                if(e.state=="ok"){
                    sessionStorage.login=e.code;
                    this.$router.push("/");
                }else{
                    this.$router.push("/login");
                    this.name="";
                    this.pass="";
                }
            })
        }
    }
})
var Reg=Vue.component('Reg',{
    template:`
    <div>
        <h3>注册页面 <router-link to="/login">登录页面</router-link></h3>
        <div>{{message}}</div>
        <form>
            用户名:<input type="text" v-model="name" @blur="blur"><br>
            密码:<input type="text" v-model="pass"><br>
            确认密码:<input type="text" v-model="surepass"><br>
            <input type="button" value="注册" @click="submit">
        </form>
    </div>`,
    data(){
        return{
            name:'',
            pass:'',
            surepass:'',
            message:'',
            flag:false
        }
    },
    methods:{
        blur(){
            var search="name="+this.name;
            fetch("/asynCheck?"+search).then(function(e){
                return e.text();
            }).then((e)=>{
                if(e=="ok"){
                    this.flag=true;
                    this.message="";
                }else{
                    this.flag=false;
                    this.message="用户名已存在";
                }
            })
        },
        submit(){
            if(!this.flag){
                this.message="用户名已存在";
                return;
            }
            if(!this.name){
                this.message="用户名不能为空";
                return;
            }
            if(!this.pass){
                this.message="密码不能为空";
                return;
            }
            if(!this.surepass){
                this.message="确认密码不能为空";
                return;
            }
            if(this.pass!==this.surepass){
                this.message="两次密码输入不一致";
                return;
            }
            var search="name="+this.name+"&pass="+this.pass;
            fetch("/addSuer?"+search).then(function(e){
                return e.text();
            }).then((e)=>{
                if(e=="ok"){
                    this.message="注册成功";
                }else{
                    this.message="注册失败";
                    this.name='';
                    this.pass='';
                    this.surepass='';
                }
            })
        }
    }
})