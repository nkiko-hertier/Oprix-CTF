declare global {
    interface Window {
      Dropbox: any;
    }
  }
  
  export const openDropboxPicker = (
    onPick: (url: string, name: string) => void
  ) => {
    if (!window.Dropbox) {
      console.error("Dropbox not loaded");
      return;
    }

    const allowedExtensions = [".pdf", ".docx", ".png", ".jpg"];
    const allowAll = '*'
  
    window.Dropbox.choose({
      linkType: "direct", // or "preview"
      multiselect: false,
      extensions: [".pdf", ".docx", ".png", ".jpg"],
      success: (files: any[]) => {
        const file = files[0];
        onPick(file.link, file.name);
      },
    });
  };
  