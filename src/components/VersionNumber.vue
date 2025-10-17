<script setup>
import { computed, watch, ref } from 'vue';

const props = defineProps({
  version: {
    type: String,
    default: '0.0.0',
    validator: (value) => /^\d+\.\d+\.\d+$/.test(value)
  }
});

const emit = defineEmits(['update:version']);

const majorVersion = ref(0);
const minorVersion = ref(0);
const patchVersion = ref(0);

// Parse version string into parts
const parseVersion = (versionString) => {
  const parts = versionString.split('.').map(num => parseInt(num, 10));
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0
  };
};

// Initialize version parts from prop
const initializeVersion = () => {
  const { major, minor, patch } = parseVersion(props.version);
  majorVersion.value = major;
  minorVersion.value = minor;
  patchVersion.value = patch;
};

// Watch for prop changes
watch(() => props.version, initializeVersion, { immediate: true });

// Computed version string
const currentVersion = computed(() =>
  `${majorVersion.value}.${minorVersion.value}.${patchVersion.value}`
);

// Emit version changes
const emitVersionUpdate = () => {
  emit('update:version', currentVersion.value);
};

// Watch individual version parts for changes
watch([majorVersion, minorVersion, patchVersion], emitVersionUpdate);

// Quick increment methods
const incrementMajor = () => {
  majorVersion.value++;
  minorVersion.value = 0;
  patchVersion.value = 0;
};

const incrementMinor = () => {
  minorVersion.value++;
  patchVersion.value = 0;
};

const incrementPatch = () => {
  patchVersion.value++;
};

</script>

<template>
  <v-row align="center" no-gutters>
    <!-- Version Display -->
    <v-col cols="12" class="mb-4">
      <v-chip
        color="primary"
        size="large"
        variant="elevated"
        class="font-weight-bold"
      >
        <v-icon start>mdi-tag</v-icon>
        v{{ currentVersion }}
      </v-chip>
    </v-col>

    <!-- Version Input Fields -->
    <v-col cols="12">
      <v-row>
        <v-col cols="4">
          <v-number-input
            v-model="majorVersion"
            label="Major"
            :min="0"
            :max="999"
            control-variant="split"
            variant="outlined"
            hide-details
          >
            <template #append-inner>
              <v-tooltip activator="parent" location="top">
                <div class="text-caption">
                  <strong>Major:</strong> Breaking changes<br>
                  Incompatible API changes
                </div>
              </v-tooltip>
            </template>
          </v-number-input>
        </v-col>

        <v-col cols="4">
          <v-number-input
            v-model="minorVersion"
            label="Minor"
            :min="0"
            :max="999"
            control-variant="split"
            variant="outlined"
            hide-details
          >
            <template #append-inner>
              <v-tooltip activator="parent" location="top">
                <div class="text-caption">
                  <strong>Minor:</strong> New features<br>
                  Backwards compatible
                </div>
              </v-tooltip>
            </template>
          </v-number-input>
        </v-col>

        <v-col cols="4">
          <v-number-input
            v-model="patchVersion"
            label="Patch"
            :min="0"
            :max="999"
            control-variant="split"
            variant="outlined"
            hide-details
          >
            <template #append-inner>
              <v-tooltip activator="parent" location="top">
                <div class="text-caption">
                  <strong>Patch:</strong> Bug fixes<br>
                  Backwards compatible
                </div>
              </v-tooltip>
            </template>
          </v-number-input>
        </v-col>
      </v-row>
    </v-col>

    <!-- Quick Actions -->
    <v-col cols="12" class="mt-4">
      <v-btn-group variant="outlined" density="compact">
        <v-btn
          @click="incrementMajor"
          prepend-icon="mdi-arrow-up-bold"
          size="small"
        >
          Major
        </v-btn>
        <v-btn
          @click="incrementMinor"
          prepend-icon="mdi-arrow-up-bold"
          size="small"
        >
          Minor
        </v-btn>
        <v-btn
          @click="incrementPatch"
          prepend-icon="mdi-arrow-up-bold"
          size="small"
        >
          Patch
        </v-btn>
      </v-btn-group>
    </v-col>
  </v-row>
</template>
