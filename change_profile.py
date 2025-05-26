import boto3
from botocore.session import get_session

for profile in get_session().available_profiles:
    try:
        session = boto3.Session(profile_name=profile)
        sts = session.client('sts')
        account = sts.get_caller_identity()['Account']
        print(f"{profile}: {account}")
    except Exception as e:
        print(f"{profile}: エラー - {e}")



