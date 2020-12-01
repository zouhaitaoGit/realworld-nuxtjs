import { mapState } from 'vuex';
<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <nuxt-link v-if="user && user.username === profile.username" to="/settings">
              <button class="btn btn-sm btn-outline-secondary action-btn">
                <i class="ion-gear-a"></i>
                &nbsp;
                Edite Profile Settings 
              </button>
            </nuxt-link>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="onFollow(profile)"
              :disabled="profile.followDisabled">
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                 <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'author'
                  }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'author',
                    }
                  }"
                  exact
                  >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                 <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited'
                  }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited',
                    }
                  }"
                  exact
                  >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>
          <div class="article-preview"
            v-for="article in articles"
            :key="article.slug">
            <div class="article-meta">
              <nuxt-link 
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link class="author" :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button 
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link class="preview-link" 
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag">{{ tag }}</li>
              </ul>
            </nuxt-link>
          </div>
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li 
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item">
                  <nuxt-link class="page-link" 
                    :to="{
                      name: 'profile',
                      query: {
                        page: item,
                        tab: tab
                      }
                    }">{{ item }}</nuxt-link>
                </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>
      </div>
    </div>

  </div>
  
</template>

<script>
import { mapState } from 'vuex'
import { 
  getProfile, 
  addFollowProfile,
  deleteFollowProfile 
  } from '@/api/profiles'
import { 
  getArticles,
  deleteFavorite,
  addFavorite,
  } from '@/api/article'
export default {
  name: 'UserProfile',
  async asyncData({ params, query }) {
    const page = Number.parseInt(query.page || 1)
    const tab = query.tab || 'author'
    const limit = 5
    const favorited = tab === 'favorited' ? params.username : undefined
    const author = tab === 'author' ? params.username : undefined

    const [ profileRes, articlesRes ] = await Promise.all([
      getProfile(params.username),
      getArticles({
        limit,
        offset: (page - 1) * limit,
        favorited, 
        author
      })
    ])
    const { profile } = profileRes.data
    const { articles, articlesCount } = articlesRes.data

    articles.forEach(article => article.favoriteDisabled = false)
    profile.followDisabled = false

    console.log(profile)
    console.log(articles)

    return {
      profile, // 当前作者信息
      articles, // 文章列表
      articlesCount, // 文章总数
      limit, // 每页大小
      page, // 页码
      tab, // 选项卡
    }
  },
  watchQuery: ['page', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite (article) {
      if(!this.user) { this.$router.push('/login'); return }
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    async onFollow (profile) {
      if(!this.user) { this.$router.push('/login'); return }
      profile.followDisabled = true
      if (profile.following) {
        // 取消关注
        await deleteFollowProfile(profile.username)
        profile.following = false
      } else {
        // 添加关注
        await addFollowProfile(profile.username)
        profile.following = true
      }
      profile.followDisabled = false
    }
  }
}
</script>

<style>

</style>