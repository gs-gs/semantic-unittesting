from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Job


class JobConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.job_id = None
        self.job = None

        if "job_id" in self.scope["url_route"]["kwargs"]:
            self.job_id = self.scope["url_route"]["kwargs"]["job_id"]
            self.job = Job.objects.get(id=self.job_id)

            async_to_sync(self.channel_layer.group_add)(
                str(self.job_id), self.channel_name
            )
        else:
            async_to_sync(self.channel_layer.group_add)("all_jobs", self.channel_name)

        return self.accept()

    def disconnect(self, code):
        if self.job_id:
            async_to_sync(self.channel_layer.group_discard)(
                self.job_id, self.channel_name
            )
        return super().disconnect(code)

    def job_create(self, event):
        self.send_json(
            {
                "type": "JOB_CREATE",
                "id": event["id"],
                "job": event["job"],
            }
        )

    def job_finish(self, event):
        self.send_json(
            {
                "type": "JOB_FINISH",
                "id": event["id"],
                "finished_on": event["finished_on"],
            }
        )

    def response_add(self, event):
        self.send_json(
            {
                "type": "RESPONSE_ADD",
                "id": event["id"],
                "assessments": event["assessments"],
            }
        )

    def assessment_add(self, event):
        self.send_json(
            {
                "type": "ASSESSMENT_ADD",
                "id": event["id"],
                "assessment": event["assessment"],
            }
        )
