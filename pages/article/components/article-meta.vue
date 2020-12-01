import { mapState } from 'vuex';
<template>
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
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <nuxt-link 
      v-if="user && user.username === article.author.username"
      :to="{
        name: 'editor',
        params: {
          slug: article.slug
        }
      }">
      <button class="btn btn-sm btn-outline-secondary">
        <i class="ion-edit"></i>
        &nbsp;
        Edite Article
        <span class="counter"></span>
      </button>
    </nuxt-link>
    <button 
      v-else 
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following
      }"
      @click="onFollow(article.author)"
      :disabled="followDisabled">
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
      <span class="counter"></span>
    </button>
    &nbsp;&nbsp;
    <button
      v-if="user && user.username === article.author.username"
      class="btn btn-sm btn-outline-danger"
      :class="{
        active: article.favorited
      }"
      @click="onDeleteArticle(article)">
      <i class="ion-trash-a"></i>
      &nbsp;
      Delete Article
    </button>
    <button 
      v-else
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
      @click="onFavorite(article)"
      :disabled="favoriteDisabled">
      <i class="ion-heart"></i>
      &nbsp;
      {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Article
      <span class="counter">({{article.favoritesCount}})</span>
    </button>
  </div>
</template>

<script>
import {
  addFollowProfile,
  deleteFollowProfile 
  } from '@/api/profiles'
import {
  addFavorite,
  deleteFavorite,
  deleteArticle
  } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      favoriteDisabled: false,
      followDisabled: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async onFavorite (article) {
      if(!this.user) { this.$router.push('/login'); return }
      this.favoriteDisabled = true
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
      this.favoriteDisabled = false
    },
    async onFollow (profile) {
      if(!this.user) { this.$router.push('/login'); return }
      this.followDisabled = true
      if (profile.following) {
        // 取消关注
        await deleteFollowProfile(profile.username)
        profile.following = false
      } else {
        // 添加关注
        await addFollowProfile(profile.username)
        profile.following = true
      }
      this.followDisabled = false
    },
    async onDeleteArticle (article) {
      try {
        await deleteArticle(article.slug)
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

</style>