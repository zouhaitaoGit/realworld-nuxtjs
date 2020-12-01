<template>
  <div>
    <!-- 顶部导航栏 -->
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/" exact>lagou</nuxt-link>
        <!-- <a class="navbar-brand" href="index.html">conduit</a> -->
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link class="nav-link" to="/" exact>Home</nuxt-link>
            <!-- <a class="nav-link active" href="">Home</a> -->
          </li>
          <template v-if="user">
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/editor">
                <i class="ion-compose"></i>&nbsp;New Post
              </nuxt-link>
              <!-- <a class="nav-link" href="">
                <i class="ion-compose"></i>&nbsp;New Post
              </a> -->
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/settings">
                <i class="ion-gear-a"></i>&nbsp;Settings
              </nuxt-link>
              <!-- <a class="nav-link" href="">
                <i class="ion-gear-a"></i>&nbsp;Settings
              </a> -->
            </li>
          </template>
          <template v-if="!user">
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
            </li>
          </template>
          <li class="nav-item" v-if="user">
            <nuxt-link class="nav-link" 
              :to="{
                name: 'profile',
                params: {
                  username: user.username 
                }
              }">
              <img class="user-pic" :src="user.image" alt="">
              {{ user.username }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
    <!-- /顶部导航栏 -->

    <!-- 子路由 -->
    <nuxt-child />
    <!-- /子路由 -->

    <!-- 底部 -->
    <footer>
      <div class="container">
        <nuxt-link class="logo-font" to="/" exact>conduit</nuxt-link>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
    <!-- /底部 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LayoutIndex',
  computed: {
    ...mapState([ 'user' ])
  },
  mounted () {
    console.log(this.user)
  }

}
</script>

<style>

</style>