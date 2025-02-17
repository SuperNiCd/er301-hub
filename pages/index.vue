<template>
  <div class="is-fluid">
    <div>
      <div class="tile is-parent">
        <div class="tile is-child is-4">
          <label class="label">Search projects</label>
          <input
            class="input"
            v-model="filterValue"
            type="search"
            autocomplete="off"
          />
        </div>
      </div>
      <div class="search-project__results">
        <ul
          class="search-project__list"
          v-if="searchProject.length != projects.length"
        >
          <li v-for="project of searchProject" :key="project.slug">
            <nuxt-link
              :to="{
                name: 'projects-slug',
                params: { slug: project.slug },
              }"
              >{{ project.title }}</nuxt-link
            >
          </li>
        </ul>
      </div>
      <div class="tile is-parent">
        <div class="field is-grouped is-grouped-multiline">
          <div
            class="control"
            v-for="(category, index) in cats"
            :key="category.category + index + category.color"
          >
            <div class="tags has-addons">
              <a
                class="tag"
                v-bind:style="[
                  category.active
                    ? { backgroundColor: category.color }
                    : { backgroundColor: category.colorPassive },
                ]"
                @click="enableCat(category)"
                >{{ category.category | upperCased }}</a
              >
              <a
                v-if="category.active"
                class="tag is-delete"
                @click="disableCat(category)"
              ></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table class="projects table is-fullwidth">
      <thead>
        <tr>
          <td>Project title</td>
          <td># units</td>
          <td>Author</td>
          <td>Latest version</td>
        </tr>
      </thead>
      <tbody>
        <tr
          class="contrib"
          v-for="(project, index) of filteredProjects"
          :key="project + index + project.author"
        >
          <td>
            <nuxt-link
              :to="{ name: 'projects-slug', params: { slug: project.slug } }"
            >
              {{ project.title }}
            </nuxt-link>
          </td>
          <td>
            {{ project.units.length }}
          </td>
          <td>
            <div class="projects-table__author">
              <avatar :userName="project.author" />
              {{ project.author }}
            </div>
          </td>
          <td>
            {{ project['latest version'] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue'

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      filterValue: '',
      searchCats: [],
    }
  },
  async asyncData({ $content, params, store }) {
    const projects = await $content('projects', params.slug)
      .where({ title: { $nin: 'Example' } })
      .sortBy('title', 'asc')
      .fetch()

    store.commit('addUniqueCats', { projects: projects, force: true })

    return {
      projects,
    }
  },
  methods: {
    enableCat: function (cat) {
      this.$store.commit('enableCat', cat)
    },
    disableCat: function (cat) {
      this.$store.commit('disableCat', cat)
    },
  },
  filters: {
    upperCased: function (data) {
      return data.replace(/^\w/, (c) => c.toUpperCase())
    },
  },
  computed: {
    cats: function () {
      return this.$store.state.cats
    },
    filteredProjects: function () {
      const activeCats = this.cats.filter((cat) => cat.active === true)
      function filterProjects(project) {
        let testArr = []
        const projectCats = [
          ...new Set(project.units.map((unit) => unit.category.toLowerCase())),
        ]
        for (let i = 0; i < activeCats.length; i++) {
          testArr.push(projectCats.includes(activeCats[i].category.toLowerCase()))
        }
        return testArr.every((test) => test === true)
      }
      var filtered = this.projects.filter(filterProjects)
      return [...filtered]
    },
    searchProject: function () {
      let result = this.projects
      if (!this.filterValue) return result

      const filterValue = this.filterValue.toLowerCase()

      const filter = (project) => {
        return (
          project.units
            .map((unit) => unit.name)
            .some((unit) => unit.toLowerCase().includes(filterValue)) ||
          project.units
            .map((unit) => unit.category.toLowerCase())
            .some((unit) => unit.toLowerCase().includes(filterValue)) ||
          project.title.toLowerCase().includes(filterValue) ||
          project.author.toLowerCase().includes(filterValue) ||
          project.description.toLowerCase().includes(filterValue)
        )
      }
      return result.filter(filter)
    },
  },
}
</script>

<style lang="scss" scoped>
.projects-table {
  &__author {
    display: flex;
    align-items: center;
  }
}
.search-project {
  &__result {
    transition: max-height 0.3s;
  }
}

.content table td,
.content table th {
  vertical-align: middle;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 40px;
  color: #35495e;
  letter-spacing: 1px;

  .index & {
    font-size: 55px;
  }
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.tags .tag {
  transition: all 0.5s;
}
</style>
