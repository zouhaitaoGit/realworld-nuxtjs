<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages"
                :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="newUser.image" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="newUser.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="newUser.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="newUser.email" class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="newUser.password" class="form-control form-control-lg" type="password" placeholder="New Password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="handleOnLogout">  
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from '@/api/user'
import { mapState } from 'vuex';
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  // 配置中间件  处理未登录跳转登录
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data () {
    return {
      newUser: {
        image: '',
        username: '',
        bio: '',
        email: '',
        password: ''
      },
      errors: {} //错误信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted () {
    console.log(this.user)
    const { image, username, bio, email } = this.user
    this.newUser = {
      image,
      username,
      bio,
      email
    }
  },
  methods: {
    async onSubmit () {
      try {
        const { data } = await updateUser(this.newUser)
        // 更新用户登录状态
        this.$store.commit('setUser', data.user)
        // 数据持久化
        Cookie.set('user', data.user)
        this.$router.push({
          name: 'profile',
          params: {
            username: data.user.username
          }
        })
      } catch (err) {
        this.errors = err.response.data.errors 
      }
    },
    handleOnLogout () {
      this.$store.commit('setUser', null)
      // 清除数据持久化
      Cookie.remove('user')
      this.$router.replace('/')
    }
  }

}
</script>

<style>

</style>