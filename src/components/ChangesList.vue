<script setup>
import { onMounted, ref, computed } from 'vue';
import { VersionUtils } from '@/libs/VersionUtils'

const props = defineProps({
  changes: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:changes']);

const tags = ref([]);
const loading = ref(false);

// Use computed for local changes to avoid watcher conflicts
const localChanges = computed({
  get: () => props.changes,
  set: (value) => emit('update:changes', value)
});

const addChange = () => {
  const newChanges = [...localChanges.value];
  newChanges.push({
    tag: '',
    description: '',
    id: Date.now() // Add unique id for better tracking
  });
  localChanges.value = newChanges;
};

const removeChange = (index) => {
  const newChanges = [...localChanges.value];
  newChanges.splice(index, 1);
  localChanges.value = newChanges;
};const validateChange = (change) => {
  return change.tag && change.description.trim();
};

onMounted(async () => {
  try {
    loading.value = true;
    const res = await VersionUtils.getChangeTagsFromConfig();
    tags.value = res;
  } catch (error) {
    console.error('Failed to load change tags:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <!-- Header with Add Button -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h4 class="text-h6">Changes</h4>
      <v-btn
        @click="addChange"
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
      >
        Add Change
      </v-btn>
    </div>

    <!-- Loading State -->
    <v-progress-linear v-if="loading" indeterminate class="mb-4" />

    <!-- Empty State -->
    <v-card v-if="localChanges.length === 0 && !loading" variant="outlined" class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1">mdi-clipboard-list-outline</v-icon>
      <div class="text-h6 mt-4 mb-2">No changes added yet</div>
      <div class="text-body-2 text-medium-emphasis mb-4">
        Add your first change to get started
      </div>
      <v-btn
        @click="addChange"
        color="primary"
        prepend-icon="mdi-plus"
      >
        Add Change
      </v-btn>
    </v-card>

    <!-- Changes List -->
    <v-list v-else>
      <v-list-item
        v-for="(change, index) in localChanges"
        :key="change.id || index"
        class="pa-0 mb-3"
      >
        <v-card variant="outlined" :color="validateChange(change) ? '' : 'error'" class="w-100">
          <v-card-text class="pb-2">
            <v-row align="center" no-gutters>
              <!-- Index -->
              <v-col cols="1" class="pr-3">
                <v-chip
                  size="small"
                  color="primary"
                  variant="tonal"
                  class="font-weight-bold"
                >
                  {{ index + 1 }}
                </v-chip>
              </v-col>

              <!-- Tag Selection -->
              <v-col cols="3" class="pr-3">
                <v-select
                  v-model="change.tag"
                  label="Type"
                  :items="tags"
                  variant="outlined"
                  density="compact"
                  :error="!change.tag"
                  :error-messages="!change.tag ? ['Type is required'] : []"
                  hide-details="auto"
                />
              </v-col>

              <!-- Description -->
              <v-col cols="7" class="pr-3">
                <v-text-field
                  v-model="change.description"
                  label="Change Description"
                  placeholder="Describe what changed..."
                  variant="outlined"
                  density="compact"
                  :error="!change.description?.trim()"
                  :error-messages="!change.description?.trim() ? ['Description is required'] : []"
                  hide-details="auto"
                />
              </v-col>

              <!-- Actions -->
              <v-col cols="1" class="text-center">
                <v-btn
                  icon="mdi-delete-outline"
                  variant="text"
                  color="error"
                  size="small"
                  @click="removeChange(index)"
                >
                  <v-icon>mdi-delete-outline</v-icon>
                  <v-tooltip activator="parent" location="top">
                    Remove this change
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>

    <!-- Summary -->
    <v-alert
      v-if="localChanges.length > 0"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      <template #title>
        Summary: {{ localChanges.length }} change{{ localChanges.length !== 1 ? 's' : '' }}
      </template>
      <div class="text-body-2">
        Valid: {{ localChanges.filter(validateChange).length }} |
        Incomplete: {{ localChanges.filter(c => !validateChange(c)).length }}
      </div>
    </v-alert>
  </div>
</template>

<style scoped>
.v-card {
  transition: all 0.2s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
