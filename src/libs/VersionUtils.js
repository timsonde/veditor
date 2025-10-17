export const VersionUtils = {

  async getChangeTagsFromConfig() {
    return await fetch('config.json').then(response => response.json()).then(config => {
      return config.tags || [];
    });
  },

  async getAuthorsFromConfig() {
    return await fetch('config.json').then(response => response.json()).then(config => {
      return config.authors || [];
    });
  }
}

export class VersionNotes {



  constructor(version, description, changes_list, author) {
    this.version = version;
    this.description = description;
    this.changes_list = changes_list;
    this.author = author;
  }

  toHtml() {
    let template = `
    <div>
      <h2>Version ${this.version}</h2>
      <p>${this.description}</p>
      <ul>
        ${this.changes_list.map(change => `<li>${change.tag} ${change.description}</li>`).join('')}
      </ul>
      <p><strong>Author:</strong> ${this.author}</p>
    </div>
  `
    return template;
  }


}
