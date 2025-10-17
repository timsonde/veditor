<script setup>
import { onMounted, ref } from 'vue';
import VersionNumber from './VersionNumber.vue';
import ChangesList from './ChangesList.vue';
import { VersionNotes, VersionUtils } from '@/libs/VersionUtils';

const formValid = ref(false);
const author = ref('');
const version = ref('0.1.0');
const description = ref('');
const changes = ref([]);
const authorList = ref([]);

const handleSubmit = () => {
  if (formValid.value) {
    const versionObj = new VersionNotes(
      version.value,
      description.value,
      changes.value,
      author.value
    );

    console.log('Form submitted:', versionObj.toHtml());
  }
};

onMounted(() => {
  VersionUtils.getAuthorsFromConfig().then((authors) => {
    authorList.value.push(...authors);
  });
});
</script>

<template>
  <v-form v-model="formValid" @submit.prevent="handleSubmit">
    <v-container>
      <!-- Version Section -->
      <v-card class="mb-4" elevation="2">
        <v-card-title class="text-h6">Version Information</v-card-title>
        <v-card-text>
          <VersionNumber v-model:version="version" />
        </v-card-text>
      </v-card>

      <!-- Author Section -->
      <v-card class="mb-4" elevation="2">
        <v-card-title class="text-h6">Author Information</v-card-title>
        <v-card-text>
          <v-select v-model="author" :items="authorList" label="Author" placeholder="Select or enter author"
            :rules="[v => !!v || 'Author is required']" required variant="outlined" clearable>
            <template #prepend>
              <v-icon>mdi-account</v-icon>
            </template>
          </v-select>
        </v-card-text>
      </v-card>

      <!-- Summary Section -->
      <v-card class="mb-4" elevation="2">
        <v-card-title class="text-h6">Release Summary</v-card-title>
        <v-card-text>
          <v-textarea v-model="description" label="Description" placeholder="Enter release notes or summary..."
            :rules="[v => !!v || 'Description is required']" required variant="outlined" rows="4" auto-grow />
        </v-card-text>
      </v-card>


      <!-- Changes Section -->
      <v-card class="mb-4" elevation="2">
        <v-card-title class="text-h6">Changes</v-card-title>
        <v-card-text>
          <ChangesList v-model:changes="changes" />
        </v-card-text>
      </v-card>

      <!-- Actions -->
      <v-row justify="end" class="mt-4">
        <v-col cols="auto">
          <v-btn variant="outlined" class="mr-2" @click="$router?.go(-1)">
            Cancel
          </v-btn>
          <v-btn type="submit" color="primary" :disabled="!formValid" size="large">
            <v-icon start>mdi-check</v-icon>
            Confirm Release
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
