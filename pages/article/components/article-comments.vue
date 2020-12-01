<template>
  <div>

     <form v-if="user" class="card comment-form" @submit.prevent="onSubmit">
        <div class="card-block">
          <textarea v-model="commentObj.comment.body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
        </div>
        <div class="card-footer">
          <img :src="user.image" class="comment-author-img" />
          <button class="btn btn-sm btn-primary">
          Post Comment
          </button>
        </div>
      </form>
      <p v-else>
        <nuxt-link to="/login">Sign in</nuxt-link> or
        <nuxt-link to="/register">sign up</nuxt-link> to add comments on this article
      </p>
      
      <div class="card"
        v-for="comment in comments"
        :key="comment.id">
        <div class="card-block">
          <p class="card-text">{{ comment.body }}</p>
        </div>
        <div class="card-footer">
          <nuxt-link class="comment-author"
            :to="{
              name: 'profile',
              params: {
                username: comment.author.username
              }
            }">
            <img :src="comment.author.image" class="comment-author-img" />
          </nuxt-link>
          &nbsp;
          <nuxt-link class="comment-author"
            :to="{
              name: 'profile',
              params: {
                username: comment.author.username
              }
            }">
            {{ comment.author.username }}
          </nuxt-link>
          <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
          <span class="mod-options">
            <!-- <i class="ion-edit"></i> -->
            <i 
              v-if="user && user.username === comment.author.username" 
              class="ion-trash-a"
              @click="deleteComment(comment)"></i>
          </span>
        </div>
      </div>
  </div>
</template>

<script>
import { getComments, commentsArticle, deleteComments } from '@/api/article'
import { mapState } from 'vuex';

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [],
      commentObj: {
        comment: {
          body: ''
        }
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  methods: {
    async onSubmit () {
      try {
        await commentsArticle(this.article.slug, this.commentObj)
        const { data } = await getComments(this.article.slug)
        this.comments = data.comments
      } catch (err) {
        // console.log(err)
      }
    },
    async deleteComment (comment) {
      try {
        await deleteComments(this.article.slug, comment.id)
        const { data } = await getComments(this.article.slug)
        this.comments = data.comments
      } catch (err) {
        // console.log(err)
      }
    }
  }
}
</script>

<style>

</style>