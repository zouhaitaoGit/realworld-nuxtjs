<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <ul class="error-messages">
          <template v-for="(messages, field) in errors">
            <li v-for="(message, index) in messages"
              :key="index">
              {{ field }} {{ message }}
            </li>
          </template>
        </ul>
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="tag" type="text" class="form-control" placeholder="Enter tags" @keyup.enter="onTagEnter">
                  <div class="tag-list">
                    <span class="tag-default tag-pill"
                      v-for="tag in article.tagList"
                      :key="tag">
                      <i class="ion-close-round" @click="removeTag(tag)"></i>
                      {{tag}}</span>
                  </div>
              </fieldset>
              <button 
                class="btn btn-lg pull-xs-right btn-primary" 
                type="button"
                @click="onSubmit">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from '@/api/article'
export default {
  // 配置中间件  处理未登录跳转登录
  middleware: 'authenticated',
  name: 'EditorIndex',
  async asyncData ({ params }) {
    if (params.slug) {
      const { data } = await getArticle(params.slug)
      const { article } = data
      return {
        article
      }
    }
  },
  data () {
    return {
      tag: '',
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      errors: {}
    }
  },
  methods: {
    async onSubmit () {
      try {
        const { data } = this.$route.params.slug ?
          await updateArticle({
              article: this.article
          }) : 
          await createArticle({
              article: this.article
          })
        this.$router.push({
          name: 'article',
          params: {
            slug: data.article.slug
          }
        })
      } catch (err) {
        this.errors = err.response.data.errors
      }
    },
    onTagEnter () {
      const index = this.article.tagList.findIndex(item => item === this.tag )
      if (index === -1) {
        this.article.tagList.push(this.tag)
        this.tag = ''
      }
    },
    removeTag (tag) {
      const index = this.article.tagList.findIndex(item => item === tag )
      index !== -1 && this.article.tagList.splice(index, 1)
    }
  }
}
</script>

<style>

</style>