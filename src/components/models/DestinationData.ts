export class DestinationData {
  destination: string = '';
  tag: string = '';

  constructor(data?: any) {
    if (!data) return;
    if (data.destination) this.destination = data.destination;
    if (data.tag) this.tag = data.tag;
  }
}
