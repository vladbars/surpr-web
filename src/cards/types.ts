/** Content shared by occasion-specific templates. No network or purchase state. */
export interface CardContent {
  recipientName: string;
  message: string;
}

export interface CardPresentationProps extends CardContent {
  previewMode?: boolean;
}
